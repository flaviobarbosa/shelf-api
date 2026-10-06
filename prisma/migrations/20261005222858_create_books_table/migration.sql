-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "isbn" TEXT NOT NULL,
    "page_count" INTEGER,
    "published_date" TEXT,
    "description" TEXT,
    "cover_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'want_to_read',
    "current_page" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "review" TEXT,
    "is_loaned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);
